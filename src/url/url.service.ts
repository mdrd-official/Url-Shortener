import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url } from './interface/url.interface'; // Adjust the path accordingly
import { UrlDto } from './dto/url.dto';


@Injectable()
export class UrlService {
  constructor(@InjectModel('urls') private readonly urlModel: Model<Url>) {}

  async shortenUrl(urlDto: UrlDto): Promise<Url> {
    console.log(urlDto);
  
    const urlCode = Math.random().toString(36).substring(7);
    const shortUrl = `${process.env.BASE_URL}/${urlCode}`;
    console.log('Short URL:', shortUrl);
    const originalUrl = urlDto.originalUrl;
    const urlObj = new this.urlModel({ ...urlDto, urlCode, shortUrl, originalUrl });
    console.log('URL Object:', urlObj);
    return urlObj.save();
  }

  async findExistingURL(url: UrlDto): Promise<Url | null> {
    console.log('URL:', url);
    const data = await this.urlModel.findOne({ urlCode: url });
    console.log('Data:', data);
    return data;  
  }
}
