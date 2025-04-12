const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const User=require("./user.js");

const listingSchema=new Schema({
    title:{
        type:String,
         required:true
    },
    description:{
        type:String,  
    },
    image:{
        // type:String,
        // default:"https://media.istockphoto.com/id/1453462927/photo/maldives-hotel-beach-resort-on-tropical-island-with-aerial-drone-view.jpg?s=2048x2048&w=is&k=20&c=dJR34mK29dm7tB1j2TuxLMgprv0z6TIoVlPQSU7zaS0=",
        // set: (v)=>v==="" ? "https://media.istockphoto.com/id/1453462927/photo/maldives-hotel-beach-resort-on-tropical-island-with-aerial-drone-view.jpg?s=2048x2048&w=is&k=20&c=dJR34mK29dm7tB1j2TuxLMgprv0z6TIoVlPQSU7zaS0=" : v,

        url: String,
        filename: String,
    }, 

    price:{
        type:Number,
        required:true
    },

    location:String,

    country:String, 

    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        },
      },

});

//Post Mongoose Middleware
listingSchema.post("findOneAndDelete", async (listing) =>{
     if(listing){
       await Review.deleteMany({_id : {$in : listing.reviews}});
     };    
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;