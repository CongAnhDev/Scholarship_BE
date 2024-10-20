import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { ChangePasswordAuthDto, CodeAuthDto, RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiBody, ApiTags } from '@nestjs/swagger';


@ApiTags('auth')
@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private rolesService: RolesService,
    ) { }

    @Public()
    @ResponseMessage("Login user")
    @UseGuards(LocalAuthGuard)
    @UseGuards(ThrottlerGuard)
    @ApiBody({ type: UserLoginDto, })
    @Post('/login')
    handleLogin(
        @Req() req,
        @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response);
    }

    @Public()
    @ResponseMessage("Register a new user")
    @Post("/register")
    async register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @Public()
    @ResponseMessage("Check code")
    @Post('check-code')
    checkCode(@Body() registerUserDto: CodeAuthDto) {
        return this.authService.checkCode(registerUserDto);
    }

    @Post('retry-active')
    @ResponseMessage("Retry active code")
    @Public()
    retryActive(@Body("email") email: string) {
        return this.authService.retryActive(email);
    }

    @Post('retry-password')
    @ResponseMessage("Retry password code")
    @Public()
    retryPassword(@Body("email") email: string) {
        return this.authService.retryPassword(email);
    }

    @Post('forgot-password')
    @ResponseMessage("Forgot password")
    @Public()
    forgotPassword(@Body() data: ChangePasswordAuthDto) {
        return this.authService.forgotPassword(data);
    }

    @ResponseMessage("Get user information")
    @UseGuards(ThrottlerGuard)
    @Throttle(6, 60)
    @Get('/account')
    async handleGetAccount(@User() user: IUser) {
        const temp = await this.rolesService.findOne(user.role._id) as any;
        return temp;
    }

    @Public()
    @ResponseMessage("Get user by refresh token")  //check refreshToken hop le
    @Get("/refresh")
    handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies["refresh_token"];

        return this.authService.processNewToken(refreshToken, response);
    }


    @ResponseMessage("Logout User")
    @Post("/logout")
    handleLogout(
        @Res({ passthrough: true }) response: Response,
        @User() user: IUser
    ) {
        return this.authService.logout(response, user);
    }
}
