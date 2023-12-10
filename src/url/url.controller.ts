import { Controller, Post, Body, Res, HttpStatus, Get, Param, Redirect } from '@nestjs/common';
import { UrlService } from './url.service';
import { Response } from 'express';

import { UrlDto } from './dto/url.dto';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  async shorten(@Body() urlDto: UrlDto, @Res() res: Response): Promise<void> {
    try {
      console.log('URL:', urlDto);
      const urlObj = await this.urlService.shortenUrl(urlDto);
      res.status(HttpStatus.OK).json(urlObj);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
  }
  @Get(':code')
  async redirect(@Param('code') code: UrlDto, @Res() res: Response): Promise<void> {
    try {
      console.log('Code:', code);
      const urlObj = await this.urlService.findExistingURL(code);
      if (urlObj) {
        res.redirect(urlObj.originalUrl);
      } else {
        res.status(HttpStatus.NOT_FOUND).json({ error: 'URL not found' });
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
  }
}