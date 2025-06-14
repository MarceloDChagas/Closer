import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}
  @Get()
  @Redirect('/api/docs', 301)
  getDocs() {
    return;
  }
}
