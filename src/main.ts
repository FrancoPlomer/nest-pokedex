import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api/v2')
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      //Estas dos configuraciones es para que los dto transformen de manera explicita la data
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )

  await app.listen(process.env.PORT);
  
  console.log(`App runing in port ${process.env.PORT}`);
  
}
bootstrap();
