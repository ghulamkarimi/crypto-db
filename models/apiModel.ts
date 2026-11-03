import mongoose from "mongoose";

const apiSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  methods: [
    {
      method: {
        type: String,
        enum: ["GET", "POST", "PUT", "DELETE"],
        required: true,
        default:"GET"
      },
      path: {
        type: String,
        required: true,
        default:"orosia.online"
      },
      desc: {
        type: String,
      },
      parameters: {
        type: String,
      },
      body: {
        name: {
          type: String,
        },
        type: {
          type: String,
        },
      },
      response: {
        errors: [
          {
            error: {
              type: String,
            },
          },
        ],
        success: {
          type: String,
        },
      },
    },
  ],
});

const Apis = mongoose.model("Api", apiSchema);
export default Apis;
