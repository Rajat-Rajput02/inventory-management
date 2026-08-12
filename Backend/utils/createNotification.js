const Notification=require("../models/Notification");

const createNotification=async(
user,
title,
message,
type="info"
)=>{

await Notification.create({

user,
title,
message,
type,

});

};

module.exports=createNotification;