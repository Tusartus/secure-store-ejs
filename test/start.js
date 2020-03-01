const expect= require('chai').expect;
it('should add numbers correctly', function(){
   const num1 = 50;
   const num2 = 5;
   expect(num1/num2).to.equal(10);

})


it('should not give a result of 10', function(){
   const num1 = 50;
   const num2 = 10;
   expect(num1/num2).not.to.equal(10);

})
     