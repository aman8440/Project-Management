import { Link } from "react-router-dom";

export const EmailCard = ({ title, slug }: { title: string; slug: string }) => {
  return (
    <>
      <div className="flex justify-between items-center w-[80vw] my-2 border border-black p-3">
        <div className=" ">{title}</div>
        <div className="">
          <Link to={`edit?slug=${slug}`}>Edit</Link>
        </div>
      </div>
    </>
  );
};