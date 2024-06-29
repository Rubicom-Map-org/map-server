import { Module } from '@nestjs/common';
import { SavedPlacesService } from './saved-places.service';
import { SavedPlacesController } from './saved-places.controller';
import {UsersModule} from "../users/users.module";
import {AuthModule} from "../auth/auth.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SavedPlace} from "./saved-places.entity";

@Module({
  providers: [SavedPlacesService],
  controllers: [SavedPlacesController],
  imports: [
      UsersModule,
      AuthModule,
      TypeOrmModule.forFeature([SavedPlace])
  ],
  exports: [
      SavedPlacesService,
      TypeOrmModule
  ]
})
export class SavedPlacesModule {}
