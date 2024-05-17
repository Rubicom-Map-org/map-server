import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from "passport";
import {Inject} from "@nestjs/common";
import {config} from "dotenv";
import * as process from "node:process";
import {ConfigService} from "@nestjs/config";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../users/users.entity";
import {Repository} from "typeorm";

