const carServices = (() => {
    async function details(ctx) {
        ctx.isAuth = auth.isAuth()
        if (auth.isAuth()) ctx.username = sessionStorage.getItem('username')
        let endpoint = `cars/${ctx.params.id}`
        ctx.car = await remote.get('appdata', endpoint, 'kinvey')
        ctx.loadPartials({
            nav: 'templates/common/nav.hbs',
            footer: 'templates/common/footer.hbs'
        }).then(function () {
            this.partial('templates/listings/details.hbs')
        })
    }

    function listAllCars() {
        let endpoint = `cars?query={}&sort={"_kmd.ect": -1}`
        return remote.get('appdata', endpoint, 'kinvey')
    }

    function createCarList(ctx) {
        let brand = ctx.params.brand
        let description = ctx.params.description
        let fuelType = ctx.params.fuelType
        let imageUrl = ctx.params.imageUrl
        let model = ctx.params.model
        let price = ctx.params.price
        let title = ctx.params.title
        let year = ctx.params.year
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(title) || title.length > 33 ||
            title === ''
        || /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(description) ||
        description === '' || description.length < 30 || description.length > 450 ||
        brand === '' || brand.length > 11 ||
            fuelType === '' || fuelType.length > 11 ||
            model === '' || model.length > 11 ||
            model.length < 4 || year.length < 4 ||
        +price > 1000000 || !/^http/.test(imageUrl)) {
            notify.showError('Invalid data entries!')
        } else {
            let data = {
                "brand": brand,
                "description":description,
                "fuel":fuelType,
                "imageUrl":imageUrl,
                "isAuthor": true,
                "model": model,
                "price": price,
                "seller": sessionStorage.getItem('username'),
                "title": title,
                "year": year,
            }
            remote.post('appdata', 'cars', 'kinvey', data)
                .then(()=>{
                    notify.showInfo('Listing created')
                    ctx.redirect('#/homePage')
                })
        }

    }

    function editCarListing(ctx) {
        let carId = ctx.params.carId
        let endpoint = `cars/${carId}`
        let brand = ctx.params.brand
        let description = ctx.params.description
        let fuelType = ctx.params.fuelType
        let imageUrl = ctx.params.imageUrl
        let model = ctx.params.model
        let price = ctx.params.price
        let title = ctx.params.title
        let year = ctx.params.year
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(title) || title.length > 33 ||
            title === ''
            || /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(description) ||
            description === '' || description.length < 30 || description.length > 450 ||
            brand === '' || brand.length > 11 ||
            fuelType === '' || fuelType.length > 11 ||
            model === '' || model.length > 11 ||
            model.length < 4 || year.length < 4 ||
            +price > 1000000 || !/^http/.test(imageUrl)) {
            notify.showError('Invalid data entries!')
        } else {
            let data = {
                "brand": brand,
                "description":description,
                "fuel":fuelType,
                "imageUrl":imageUrl,
                "isAuthor": true,
                "model": model,
                "price": price,
                "seller": sessionStorage.getItem('username'),
                "title": title,
                "year": year,
            }
            remote.update('appdata', endpoint, 'kinvey', data)
                .then(()=>{
                    notify.showInfo('Listing edited')
                    ctx.redirect('#/homePage')
                })
        }
    }
    function deleteCarListing(ctx) {
        let carId = ctx.params.id
        let endpoint = `cars/${carId}`
        remote.remove('appdata', endpoint, 'kinvey')
            .then(function () {
                notify.showInfo('Listing deleted')
                ctx.redirect('#/homePage')
            })
    }
    async function myCarsListing(ctx) {
        ctx.isAuth = auth.isAuth()
        if (auth.isAuth()) ctx.username = sessionStorage.getItem('username')
        let username = sessionStorage.getItem('username')
        let endpoint = `cars?query={"seller":"${username}"}&sort={"_kmd.ect": -1}`
        let myCars =  await remote.get('appdata', endpoint, 'kinvey')
        ctx.isCar = myCars.length === 0
        ctx.myCars = myCars
        ctx.loadPartials({
            nav: 'templates/common/nav.hbs',
            footer: 'templates/common/footer.hbs',
            mySingle: 'templates/listings/mySingle.hbs'
        }).then(function () {
            this.partial('templates/listings/myListing.hbs')
        })
    }
    return {
        listAllCars,
        createCarList,
        editCarListing,
        deleteCarListing,
        myCarsListing,
        details
    }
})()