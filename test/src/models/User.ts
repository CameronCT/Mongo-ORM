import Model from "mongoorm/Model";

const User = new Model("User", [
    { name: "name", type: "string", required: true },
    { name: "email", type: "string", required: true },
    { name: "password", type: "string", required: true },
    { name: "updated_at", type: "date", default: new Date() }
], [ 
    { name: "uniqueEmail", fields: { email: "text" } },
])

export default User;