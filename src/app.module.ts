import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ProductsModule } from './products/products.module';
import { PrismaService } from './prisma.service';
import { EventStoreService } from './eventStore.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: [process.cwd(), 'src/schema.gql'].join('/'),
    }),
    ProductsModule,
    // EventStoreModule.register({
    //   type: 'event-store',
    //   tcpEndpoint: {
    //     host: 'localhost',
    //     port: 1113,
    //   },
    //   options: {
    //     defaultUserCredentials: {
    //       username: 'admin',
    //       password: 'changeit',
    //     },
    //   },
    // }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
