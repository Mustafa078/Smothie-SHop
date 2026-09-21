import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Developer from "../../assets/developer.png";
import { z } from "zod";
import "./about.css";
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  text: z.string().min(1, "Message is required"),
});
const About = () => {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
  });
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <main className="about-page">
      <section className="about-bio">
        <div className="about-bio__image-wrap">
          <img src={Developer} alt="Muhammad Faizan Mustafa" />
        </div>
        <div className="about-bio__content">
          <p className="about-eyebrow">Behind the blend</p>
          <h1>Muhammad Faizan Mustafa</h1>
          <p className="about-bio__text">
            Hi, I'm Muhammad — a software engineering student and MERN stack
            developer. This project is where I brought together everything I've
            learned about React, from data fetching to authentication to a full
            checkout flow, into one real build.
          </p>
        </div>
      </section>
      <form className="about-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="about-form__heading">
          <p className="about-eyebrow">Say hello</p>
          <h2>Let&apos;s talk smoothies</h2>
          <p>Have a question or a fresh idea? Send a message.</p>
        </div>
        <label className="about-form__field" htmlFor="name">
          Name:
          <input
            className="about-form__input"
            type="text"
            {...register("name")}
            id="name"
          />
          {formState.errors.name ? (
            <span className="about-form__error">
              {formState.errors.name.message}
            </span>
          ) : null}
        </label>
        <label className="about-form__field" htmlFor="email">
          Email:
          <input
            className="about-form__input"
            type="email"
            {...register("email")}
            id="email"
          />
          {formState.errors.email ? (
            <span className="about-form__error">
              {formState.errors.email.message}
            </span>
          ) : null}
        </label>
        <label className="about-form__field" htmlFor="message">
          Message:
          <textarea
            className="about-form__input about-form__textarea"
            id="message"
            {...register("text")}
          ></textarea>
          {formState.errors.text ? (
            <span className="about-form__error">
              {formState.errors.text.message}
            </span>
          ) : null}
        </label>
        <button className="about-form__submit" type="submit">
          Send message
        </button>
      </form>
    </main>
  );
};
export default About;
