import FieldTypes from "mongoorm/FieldTypes";
import Model from "mongoorm/Model";

const User = new Model("users", [
    { name: "name", type: FieldTypes.String, required: true },
    { name: "email", type: FieldTypes.String, required: true },
    { name: "password", type: FieldTypes.String, required: true },
    { name: "type", type: FieldTypes.String, default: "basic" },
], [ 
    { name: "uniqueEmail", fields: { email: "text" } },
], { 
    debug: true,
    log: 0
})

export default User;