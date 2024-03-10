import Container from "../components/container/Container";
import AllPosts from "./AllPosts";

const Home = () => {
  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          <div className="p-2 w-1/4">
            <AllPosts />
          </div>
        </div>
      </Container>
    </div>
  );
};
export default Home;
