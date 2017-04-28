var RandomCartApp = angular.module('RandomCartApp',[]);

RandomCartApp
  .service('Cart', ['$rootScope', 'Storage', function ($rootScope, Storage) { 
      var that = this;
    
      $rootScope.$on('onStorageModify', function()  {
        that.refresh();
      });
    
      this._cart = {};
    
      this._cartLookUp = function(id)  {
        return this._cart.hasOwnProperty(id) ? true : false;
      }
    
      this.getCart = function(){
        this._cart = Storage.fetch();
        if(!this._cart) { this._cart = {}; }
        
        return this._cart;
      };
  
      this.addItem = function(product){
        if(this._cartLookUp(product.id))  {
          this.changeQuantity(product.id);
        }else {
          this._newItem(product);
        }
        
        this.save();
      };
      
      this._newItem = function(product)  {
        product.quantity = 1;
        this._cart[product.id] = product;
      };
  
      this.addItems = function(products) {
        angular.forEach(products, function(product) {
          this.addItem(product);
        }, this);
      };
  
      this.save = function() {
        Storage.save(this._cart);
      };
  
      this.remove = function (id) {
        if(!--this._cart[id].quantity) { delete this._cart[id]; }
        this.save();
      };
  
      this.clear = function() {
        this._cart = {};
        Storage.remove();
      };
  
      this.persist = function() {};
  
      this.changeQuantity = function (id){
        this._cart[id].quantity++;
      };
  
      this.refresh = function() {
        $rootScope.$broadcast('onCartUpdate')
      };
  }]);

RandomCartApp
  .factory('DummyData', function()  {
    return [
      {
        id : 'MOBILE01', name : 'OnePlus 3T', price : 'Rs 29,999',
        description : '16MP primary camera with high speed autofocus technology (PDAF).'
      },
      {
        id : 'MOBILE02', name : 'OnePlus 2', price : 'Rs 20,999',
        description : '13MP primary camera with f/2.0 Aperture, 1.3 µm Pixels, 6-lenses, Dual LED Flash.'
      },
      {
        id : 'MOBILE03', name : 'OnePlus 1', price : 'Rs 21,999',
        description : 'Android Lollipop with CyanogenOS 12 and OxygenOS - 2.5GHz Qualcomm Snapdragon 801.'
      }
    ];
  });

RandomCartApp
  .provider('Storage', function ()  {
    
    var identifier;
    
    return {
      setSourceIdentifier : function(id) {
        identifier = id;
      },
      
      $get : ['$rootScope', '$window', function($rootScope, $window) {
        
        angular.element($window).on('storage', function (event) {
          if (event.key === identifier) {
            $rootScope.$broadcast('onStorageModify');
          }
        });
        
        return {
          save : function(data)  {
            localStorage.setItem(identifier, JSON.stringify(data));
          },
      
          fetch : function() {
            return JSON.parse(localStorage.getItem(identifier));
          },
      
          remove : function()  {
            localStorage.removeItem(identifier);
          }
        };
      }]
    }
  });
  
RandomCartApp
  .config(function(StorageProvider)  {
    StorageProvider.setSourceIdentifier('cart');
  });
  
RandomCartApp
  .controller('ItemListController', ['$rootScope', '$scope', 'Cart', 'DummyData',
    function($rootScope, $scope, Cart, DummyData) {
      
      $scope.cart = Cart.getCart();
      $scope.products = DummyData;
      $scope.addProduct = function(index)  {
        Cart.addItem($scope.products[index]);
      };
      $scope.removeProduct = function(index)  {
        Cart.remove(index);
      };
      
      $rootScope.$on('onCartUpdate', function() {
        $scope.$apply(function()  {
          $scope.cart = Cart.getCart();
        });
      });
    }
  ]);