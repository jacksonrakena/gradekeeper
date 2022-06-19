import mongoose, { InferSchemaType, Schema } from "mongoose";

export interface UserObject {
  provider: string;
  providerId: string;
  gradeMap: any;
  studyBlocks: {
    id: string;
    userId: string;
    name: string;
    startDate: Date;
    endDate: Date;
    subjects: {
      id: string;
      studyBlockId: string;
      longName: string;
      courseCodeName: string;
      courseCodeNumber: string;
      color: string;
      components: {
        id: string;
        subjectId: string;
        name: string;
        nameOfSubcomponentSingular: string;
        subjectWeighting: number;
        numberOfSubComponentsToDrop_Lowest: number;
        subcomponents: {
          id: string;
          componentId: string;
          isCompleted: boolean;
          overrideName: string;
          numberInSequence: number;
          gradeValuePercentage: number;
        }[]
      }[]
    }[]
  }[];
}

// const userSchema = new mongoose.Schema({
//   provider: String,
//   providerId: { type: String, index: true },
//   gradeMap: {},
//   studyBlocks: [
//     {
//       id: String,
//       userId: String,
//       name: String,
//       startDate: Date,
//       endDate: Date,
//       subjects: [
//         {
//           id: String,
//           studyBlockId: String,
//           longName: String,
//           courseCodeName: String,
//           courseCodeNumber: String,
//           color: String,
//           components: [
//             {
//               id: String,
//               subjectId: String,
//               name: String,
//               nameOfSubcomponentSingular: String,
//               subjectWeighting: Number,
//               numberOfSubComponentsToDrop_Lowest: Number,
//               subcomponents: [
//                 {
//                   id: String,
//                   componentId: String,
//                   isCompleted: Boolean,
//                   overrideName: String,
//                   numberInSequence: Number,
//                   gradeValuePercentage: Number,
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// });
const userSchema = new Schema<UserObject>();
export type AppUser = InferSchemaType<typeof userSchema>;

export const User = mongoose.models.User ?? mongoose.model("User", userSchema, "user_v2", { overwriteModels: false });
export async function database() {
  await mongoose.connect(process.env.MONGO_URL ?? "", { dbName: "gradekeeper" });
  return {
    User: User,
    client: mongoose,
  };
}
