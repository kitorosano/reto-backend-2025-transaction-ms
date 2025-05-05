import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthDrivers, PersistenceDrivers } from 'src/config/bootstrap';
import environment from 'src/config/environment';
import { JWTModule } from './jwt/jwt.module';
import { MongoDBModule } from './mongodb/mongodb.module';

@Module({})
export class InfrastructureModule {
  static use(persistenceDriver: PersistenceDrivers, authDriver: AuthDrivers) {
    // Adapter Modules
    const authModule = authDriver === 'jwt' ? JWTModule : JWTModule; // TODO: Add other auth modules
    const persistenceModule =
      persistenceDriver === 'mongodb' ? MongoDBModule : MongoDBModule; // TODO: Add other persistence modules

    const persistenceImports =
      persistenceDriver === 'mongodb'
        ? [MongooseModule.forRoot(environment.persistenceDriverUri)]
        : [];

    return {
      module: InfrastructureModule,
      imports: [...persistenceImports, persistenceModule, authModule],
      exports: [persistenceModule, authModule],
    };
  }
}
