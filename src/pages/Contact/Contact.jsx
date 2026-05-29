import ContactForm from "../../components/ContactForm";
import styles from "./Contact.module.css";

function Contact() {
    return (
        <section className={styles["contact-section"]}>
            <ContactForm />
        </section>
    );
}

export default Contact;