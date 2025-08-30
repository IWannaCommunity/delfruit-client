import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AnyElem } from "@/utils/element";
import { useState } from "react";

export default function ComposePage(): AnyElem {

  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({...prev,[name]: value}));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

	return (
		<div>
			<Head>
				<title>Delicious Fruit</title>
			</Head>
			<div id="container">
				<Header />
				<div id="content">
					<h2>Send a PM</h2>
					<form onSubmit={handleSubmit}>
						<div>
							<label className="ml-9">To: </label>
							<input
								type="text"
								name="to"
								value={formData.to}
								onChange={handleChange}
							/>
						</div>

						<div>
							<label>Subject: </label>
							<input
								type="text"
								name="subject"
								maxLength={100}
								value={formData.subject}
								onChange={handleChange}
							/>
						</div>

						<div>
							<label>Message:</label>
							<br />
							<textarea
								name="message"
								maxLength={5000}
								value={formData.message}
								onChange={handleChange}
							/>
						</div>

						<div>
							<button type="submit">Send</button>
						</div>
					</form>
				</div>
				<Footer />
			</div>
		</div>
	);
}