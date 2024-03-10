import Container from "../components/container/Container";
import PostCard from "../components/PostCard";

const Post = () => {
  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          <div className="p-2 w-1/4">
            <PostCard />
          </div>
        </div>
      </Container>
    </div>
  );
};
export default Post;
