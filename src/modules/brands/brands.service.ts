import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { FilterBrandDto } from './dto/filters-brand.dto';
import { Brand, BrandDocument } from './schemas/brands.schema';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name)
    private brandModel: Model<BrandDocument>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<BrandDocument> {
    const createdBrand = new this.brandModel(createBrandDto);
    return createdBrand.save();
  }

  async findAll(
    options: any,
    filters: FilterBrandDto,
  ): Promise<BrandDocument[] & any> {
    const { page, limit } = options;

    const resPerPage = limit || 10;
    const currentPage = Number(page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = filters?.name
      ? {
          name: {
            $regex: filters?.name,
            $options: 'i',
          },
        }
      : {};

    const brands = await this.brandModel
      .find({ ...keyword })
      .sort({ _id: 1 })
      .limit(resPerPage)
      .skip(skip);

    const count = await this.brandModel.find({ ...keyword }).count();

    return { brands, count };
  }

  async findById(id: string): Promise<BrandDocument> {
    return this.brandModel.findById(id);
  }

  async findBySlug(slug: string, status: boolean): Promise<BrandDocument> {
    return this.brandModel.findOne({ slug: slug }, { status: status }).exec();
  }

  async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<BrandDocument> {
    return this.brandModel
      .findByIdAndUpdate(id, updateBrandDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<BrandDocument> {
    return this.brandModel.findByIdAndDelete(id).exec();
  }
}
