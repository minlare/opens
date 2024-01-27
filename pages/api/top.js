import { parse } from "node-html-parser";

const fetchData = async () => {
  const response = await fetch("https://www.golfempire.reviews/top/top-inland");
  const html = await response.text();
  const root = parse(html);
  const posts = root.querySelectorAll(".post-info");

  const courses = {};
  for (const post of posts) {
    courses[post.querySelector(".h2").textContent] =
      post.querySelector(".text-block-5").textContent;
  }
  return courses;
};

export default async function handler(req, res) {
  try {
    const courses = await fetchData();
    res.status(200).json(courses);
  } catch (e) {
    res.status(500).json(e.message);
  }
}
