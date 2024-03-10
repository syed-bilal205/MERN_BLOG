import Button from "./Button";
import Input from "./Input";
import RTE from "./RTE";
import { useForm } from "react-hook-form";

const PostForm = ({ post }) => {
  const { register, watch, setValue, control, getValues, handleSubmit } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        content: post?.content || "",
      },
    });
  return (
    <form onSubmit={handleSubmit()} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
};
export default PostForm;
