import { Link } from "react-router-dom";
import styles from "../../styles/Categories.module.css";

const Categories = ({ title, style = {}, categories = [], amount }) => {
  const list = categories.filter((_, i) => i < amount);
  console.log('cat in cat: ', list)

  return (
    <section className={styles.section} style = {style}>
      <h2>{title}</h2>
      <div className={styles.list}>
        {list.map(({ id, name, image }) => (
          <Link to={`/categories/${id}`} key={id} className={styles.item}>
            <div
              className={styles.image}
              style={{ backgroundImage: `url(${image})` }}
            />
            <h3 className={styles.title}>{name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
