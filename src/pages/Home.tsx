import { Link } from 'react-router';
import NavBar from '../components/NavBar';

function Hero() {

  return (
    <section className="flex flex-col items-center justify-center h-screen text-center px-6">
      <h1 className="text-6xl font-bold">
        Shop Without Limits
      </h1>
      <h3 className="text-gray-600 text-lg mt-5 font-bold">
        Less Searching. More Finding.
      </h3>
      <p className="text-gray-500 text-lg mb-5 max-w-xl">
        Discover thousands of products across fashion, tech, home and more — all in one place, with fast delivery and easy returns.
      </p>
      <Link to={"/products"}><button className="bg-black text-[white] px-6 py-3 rounded-full hover:opacity-80">
        Browse Products</button></Link>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="bg-[#E5E5E5]">
      <NavBar/>
      <Hero />
    </div>
  );
}
