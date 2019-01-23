$(()=>{
    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs')

        this.get('index.html', routing.welcomePage)
        this.get('#/home', routing.welcomePage)

        this.get('#/register', routing.getRegister)
        this.post('#/register', routing.postRegister)
        this.get('#/login', routing.getLogin)
        this.post('#/login', routing.postLogin)
        this.get('#/logout', routing.logout)

        this.get('#/homePage', routing.homePage)
        this.get('#/allListings', routing.allListings)
        this.get('#/createCar', routing.getCreate)
        this.post('#/createCar', carServices.createCarList)
        this.get('#/carDetails/:id', carServices.details)
        this.get('#/carEdit/:id', routing.getCarEdit)
        this.post('#/editCar', carServices.editCarListing)
        this.get('#/carDelete/:id', carServices.deleteCarListing)
        this.get('#/myListing', carServices.myCarsListing)

    })
    app.run()
})