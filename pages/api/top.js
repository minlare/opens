import { parse } from "node-html-parser";

("https://www.golfempire.reviews/top/top-links-england");
("https://www.golfempire.reviews/top/top-inland");

const courses = {};

const getCourses = async (href) => {
  const response = await fetch(href);
  const html = await response.text();
  const root = parse(html);
  const posts = root.querySelectorAll(".post-info");

  for (const post of posts) {
    courses[post.querySelector(".h2").textContent] =
      post.querySelector(".text-block-5").textContent;
  }
};

const fetchData = async () => {
  await getCourses("https://www.golfempire.reviews/top/top-inland");
  await getCourses("https://www.golfempire.reviews/top/top-links-england");

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
