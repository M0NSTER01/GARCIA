# Gracia: AI-Based Body Shape Detection Using Gemini

Gracia is a personal style recommendation website designed specifically for women. It utilizes AI-based body shape detection using the Gemini API to offer personalized advice on the best accessories and dresses to enhance your natural beauty.

## Features

- **Personalized Analysis:** Enter your measurements and details about your body shape, and let our smart algorithm suggest styles tailored just for you.
- **Curated Recommendations:** Receive hand-picked suggestions for accessories and dresses that complement your unique figure.
- **Style Boost:** Enhance your look with tips and trends designed to boost your confidence and overall style.

## How It Works

1. **Input Your Details:** Provide simple details about your body shape and measurements.
2. **Receive Custom Recommendations:** Our system analyzes your data and curates a list of the best accessories and dresses.
3. **Elevate Your Style:** Implement our suggestions to feel confident and look your best.

## Demo

Experience Gracia in action by visiting our live demo at [Gracia Official](https://garciaofficial.netlify.app/).

> **Important Notice:**  
> The link above is an older version of the website that does not use any API. It is only a demo showcasing the website's interface and does not perform actual body shape detection. The output remains the same for every input.

> Since this project now uses the Gemini API for body shape detection, a free demo is no longer provided. To use this project, you must use your own Gemini API along with your own Supabase database.

---

## Gemini API & Supabase Integration

This project is now based on the Gemini API for body shape detection. To configure your API keys and database details, follow these instructions:

### Gemini API Configuration

1. Open the file: `src/services/geminiservices.ts`.
2. Locate line number 9 and update the API key:
   ```js
   const API_KEY = 'YOUR_GEMINI_API_KEY'; // This key needs to be unrestricted in Google Cloud Console
   ```
   Replace 'YOUR_GEMINI_API_KEY' with your actual Gemini API key.

### Supabase Configuration

**Client Setup:**

1. Open the file: `src/integration/client.ts`.
2. Update the configuration with your Supabase details:
   ```js
   const SUPABASE_URL = "YOUR_SUPABASE_URL";
   const SUPABASE_PUBLISHABLE_KEY = "YOUR_SUPABSE_ANON_PUBLIC_KEY";
   ```

**Project ID Setup:**

1. Open the file: `/supabase/config.toml`.
2. Update the project ID:
   ```toml
   project_id = "YOUR_SUPABSE_PROJECTID"
   ```
   Replace with your actual Supabase project ID.

### Testing Your Integration

To test your API key and check which model your key supports, add `/TestGemini` to your URL.

This will redirect you to a page where you can:

- Test text generation for the specific model.
- Verify image identification capabilities.

## Getting Started (For Users)

Simply head to our website and follow the on-screen instructions. Whether you're looking to refresh your wardrobe or seeking new style inspiration, Gracia is here to guide you.

## Development Setup

For those interested in contributing or running Gracia locally, follow these steps:

### Using Your Preferred IDE

1. Clone the Repository:
   ```sh
   git clone <YOUR_GIT_URL>
   ```
2. Navigate to the Project Directory:
   ```sh
   cd <YOUR_PROJECT_NAME>
   ```
3. Install Dependencies:
   ```sh
   npm i
   ```
4. Start the Development Server:
   ```sh
   npm run dev
   ```
   **Note:** Ensure that you have Node.js & npm installed. We recommend installing Node.js via `nvm`.

### Editing Directly in GitHub

1. Navigate to the desired file in the repository.
2. Click the "Edit" button (pencil icon) at the top right.
3. Make your changes and commit them directly on GitHub.

### Using GitHub Codespaces

1. From the repository’s main page, click on the "Code" button.
2. Select the "Codespaces" tab and click "New codespace" to launch an environment.
3. Edit the files within Codespaces and commit your changes when finished.

## Technologies Used

This project is built with:

- **Vite**
- **TypeScript**
- **React**
- **shadcn-ui**
- **Tailwind CSS**

## Deployment

To deploy Gracia:

- **Quick Deployment:** Use services like Netlify to deploy your project under your own domain.
- For further deployment options or custom configurations, please refer to the documentation provided by your chosen hosting service.

## Contributing

We welcome contributions! To help improve Gracia:

1. Fork the repository.
2. Create a new branch with your changes.
3. Submit a pull request detailing your enhancements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Contact

For any questions, suggestions, or feedback, please reach out at raghavendrarameshsingh@gmail.com.
