class ApiFeatures {
    constructor(query,queryStr){
        this.query = query;
        this.queryStr=queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name : {
                $regex : this.queryStr.keyword,
                $options : 'i',
            }
        } : {};
        this.query = this.query.find({...keyword});
        return this
    }

    filter(){
        let copyQuery  = {...this.queryStr};
        const removeQuery = ["keyword","page","limit"];
        removeQuery.forEach((key)=>{
            delete copyQuery[key];
        })
        let strQueryObj = JSON.stringify(copyQuery);
        strQueryObj = strQueryObj.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);
        copyQuery = JSON.parse(strQueryObj);
        this.query = this.query.find(copyQuery)
        return this;
    }

    pagination(resultPerPage){
        let currentPage = +this.queryStr.page || 1;
        let skip = resultPerPage * (currentPage-1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures;