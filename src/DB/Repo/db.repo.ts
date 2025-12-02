import { Model, MongooseBaseQueryOptions, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, RootFilterQuery, Types, UpdateQuery, UpdateWithAggregationPipeline } from "mongoose";



export abstract class DBRepo<T> {
    constructor(private readonly model: Model<T>) { }

    async find({
        filter={},
        projection = {},
        options = {}
    }:
        {
            filter?: RootFilterQuery<T>,
            projection?: ProjectionType<T>,
            options?: QueryOptions<T>
        }
    ) {
        return await this.model.find(filter,projection,options)
    }


    async findOne({
        filter,
        projection = {},
        options = {}
    }:
        {
            filter: RootFilterQuery<T>,
            projection?: ProjectionType<T>,
            options?: QueryOptions<T>
        }) {
        return await this.model.findOne(filter,projection,options)
    }


    async findById({
        id,
        projection = {},
        options = {}
    }:
        {
            id: any,
            projection?: ProjectionType<T>,
            options?: QueryOptions<T>
        }) {
        return await this.model.findById(id, projection, options)
    }


    async create({ data }: { data: T }) {
        return await this.model.create(data)
    }


    async findByIdAndUpdate(
        {
            id,
            update,
            options

        }:
            {
                id: Types.ObjectId,
                update: UpdateQuery<T>,
                options?: QueryOptions<T>
            }
    ) {
        return this.model.findByIdAndUpdate(id, update, options)
    }


    async findOneAndUpdate(
        {
            filter,
            update,
            options

        }:
            {
                filter: RootFilterQuery<T>,
                update: UpdateQuery<T>,
                options?: QueryOptions<T>
            }
    ) {
        return this.model.findOneAndUpdate(filter, update, options)
    }


    async findByIdAndDelete(
        {
            id,
            options

        }:
            {
                id: Types.ObjectId,
                options?: QueryOptions<T>
            }
    ) {
        return this.model.findByIdAndDelete(id, options)
    }


    async findOneAndDelete(
        {
            filter,
            options

        }:
            {
                filter: RootFilterQuery<T>,
                options?: QueryOptions<T>
            }
    ) {
        return this.model.findOneAndDelete(filter, options)
    }

    async updateOne(
        {
            filter,
            update,
            options
        }: {
            filter: RootFilterQuery<T>,
            update: UpdateQuery<T> | UpdateWithAggregationPipeline,
            options?: (MongooseUpdateQueryOptions)
        }
    ) {
        return this.model.updateOne(filter, update, options)
    }
    async deleteOne({
        filter,
        options
    }: {
        filter: RootFilterQuery<T>,
        options?: (MongooseBaseQueryOptions<T>)
    }) {
        return this.model.deleteOne(filter,options)
    }
}
