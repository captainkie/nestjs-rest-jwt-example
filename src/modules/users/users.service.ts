import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filters-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(
    options: any,
    filters: FilterUserDto,
  ): Promise<UserDocument[] & any> {
    const { page, limit } = options;

    const resPerPage = limit || 10;
    const currentPage = Number(page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = {};
    if (filters?.name) {
      keyword['name'] = { $regex: filters?.name, $options: 'i' };
    }
    if (filters?.surname) {
      keyword['surname'] = { $regex: filters?.surname, $options: 'i' };
    }
    if (filters?.email) {
      keyword['email'] = { $regex: filters?.email, $options: 'i' };
    }

    const users = await this.userModel
      .find({ ...keyword })
      .sort({ _id: 1 })
      .limit(resPerPage)
      .skip(skip);

    const count = await this.userModel.find({ ...keyword }).count();

    return { users, count };
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async findByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ username }).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
