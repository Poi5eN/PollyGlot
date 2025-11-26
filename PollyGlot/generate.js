// generate.js — Works in Vite/browser
import { HfInference } from '@huggingface/inference'

// Set active nav link based on current page
const currentPage = window.location.pathname
const navLinks = document.querySelectorAll('.nav-link')
for (const link of navLinks) {
    link.classList.remove('active')
    if (link.getAttribute('href') === currentPage || 
        (currentPage.includes('generate') && link.getAttribute('href').includes('generate'))) {
        link.classList.add('active')
    }
}

const outputImg = document.getElementById('output-img')

// Initialize Hugging Face Inference client
const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;
if (!HF_TOKEN) {
    console.error('VITE_HF_TOKEN is not set in .env file');
}

const hf = new HfInference(HF_TOKEN);

// Get API toggle element and indicator
const apiToggle = document.getElementById('api-toggle')
const apiIndicator = document.getElementById('api-indicator')
const pollinationsLabel = document.getElementById('pollinations-label')
const huggingfaceLabel = document.getElementById('huggingface-label')

// Update indicator when toggle changes
apiToggle.addEventListener('change', () => {
    if (apiToggle.checked) {
        apiIndicator.innerHTML = 'Using: <strong>hFAI</strong>'
        pollinationsLabel.style.opacity = '0.6'
        huggingfaceLabel.style.opacity = '1'
    } else {
        apiIndicator.innerHTML = 'Using: <strong>pAI</strong>'
        pollinationsLabel.style.opacity = '1'
        huggingfaceLabel.style.opacity = '0.6'
    }
})

// Initialize on page load
if (apiToggle.checked) {
    pollinationsLabel.style.opacity = '0.6'
    huggingfaceLabel.style.opacity = '1'
} else {
    pollinationsLabel.style.opacity = '1'
    huggingfaceLabel.style.opacity = '0.6'
    apiIndicator.innerHTML = 'Using: <strong>Pollinations</strong>'
}

// Main generate function that routes to the selected API
document.getElementById("submit-btn").addEventListener("click", () => {
    const prompt = document.getElementById("instruction").value
    if (!prompt) return alert('Enter a prompt!')
    
    // Check which API is selected (toggle checked = Hugging Face, unchecked = Pollinations)
    if (apiToggle.checked) {
        generateImageHuggingFace(prompt)
    } else {
        generateImagePollinations(prompt)
    }
})

// 1- Pollinations API
async function generateImagePollinations(prompt) {
    try {
        outputImg.innerHTML = '<p style="color: rgba(255,255,255,0.9); font-size: 18px;">🎨 Generating with Pollinations...<br><span style="font-size: 14px; opacity: 0.7;">This may take 8-20 seconds</span></p>'
        
        const submitBtn = document.getElementById('submit-btn')
        submitBtn.disabled = true
        submitBtn.textContent = 'Creating...'

        const res = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`)
        
        if (!res.ok) {
            throw new Error('Failed to generate image. Please try again.')
        }

        const blob = await res.blob()
        const url = URL.createObjectURL(blob)

        outputImg.innerHTML = `<img src="${url}" alt="Generated Art" style="max-width:100%; border-radius:12px; box-shadow: 0 8px 30px rgba(0,0,0,0.4);">`
        
        submitBtn.disabled = false
        submitBtn.textContent = 'Create Art'
    } catch (error) {
        outputImg.innerHTML = `<p style="color: #ff6b6b; font-size: 16px; padding: 20px;">❌ ${error.message}</p>`
        const submitBtn = document.getElementById('submit-btn')
        submitBtn.disabled = false
        submitBtn.textContent = 'Create Art'
    }
}

// 2- Hugging Face API (using @huggingface/inference SDK)
async function generateImageHuggingFace(prompt) {
    if (!prompt) {
        outputImg.innerHTML = '<p style="color:red;">Enter a prompt!</p>';
        return;
    }

    if (!HF_TOKEN) {
        outputImg.innerHTML = '<p style="color:red;">VITE_HF_TOKEN is required. Please add it to your .env file.</p>';
        return;
    }

    const submitBtn = document.getElementById('submit-btn')
    
    try {
        outputImg.innerHTML = '<p style="color: rgba(255,255,255,0.9); font-size: 18px;">🎨 Generating with Hugging Face...<br><span style="font-size: 14px; opacity: 0.7;">This may take 10-30 seconds</span></p>';
        submitBtn.disabled = true
        submitBtn.textContent = 'Creating...'

        console.log('Using Hugging Face Inference SDK');
        console.log('Model: stabilityai/stable-diffusion-xl-base-1.0');
        console.log('Prompt:', prompt.substring(0, 50) + '...');

        // Use the SDK's textToImage method - it handles endpoint routing automatically
        const imageBlob = await hf.textToImage({
            model: 'stabilityai/stable-diffusion-xl-base-1.0',
            inputs: prompt,
            parameters: {
                num_inference_steps: 20,
                guidance_scale: 7.5,
                width: 512,
                height: 512
            }
        });

        console.log('Image generated successfully, size:', imageBlob.size, 'bytes');

        // Convert blob to base64 for display
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;
            outputImg.innerHTML = `<img src="${base64}" alt="Generated Image" style="max-width:100%; border-radius:12px; box-shadow: 0 8px 30px rgba(0,0,0,0.4);">`;
            submitBtn.disabled = false
            submitBtn.textContent = 'Create Art'
        };
        reader.onerror = () => {
            throw new Error('Failed to convert image blob to base64');
        };
        reader.readAsDataURL(imageBlob);

    } catch (error) {
        console.error('HF Error:', error);
        let errorMessage = error.message || error.toString();
        let errorHtml = `<p style="color: #ff6b6b; font-size: 16px; padding: 20px;">❌ ${errorMessage}</p>`;
        
        // Add helpful tips based on error
        if (errorMessage.includes('loading') || errorMessage.includes('503')) {
            errorHtml += `<p style="color: rgba(255,255,255,0.8); font-size: 14px; padding: 10px 20px;">💡 Tip: Hugging Face models go to sleep after inactivity. Wait 30-60 seconds and try again.</p>`;
        } else if (errorMessage.includes('Rate limit') || errorMessage.includes('429')) {
            errorHtml += `<p style="color: rgba(255,255,255,0.8); font-size: 14px; padding: 10px 20px;">💡 Tip: Rate limit exceeded. Please wait a moment and try again.</p>`;
        } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
            errorHtml += `<p style="color: rgba(255,255,255,0.8); font-size: 14px; padding: 10px 20px;">💡 Tip: Please check your VITE_HF_TOKEN in .env file.</p>`;
        } else {
            errorHtml += `<p style="color: rgba(255,255,255,0.8); font-size: 14px; padding: 10px 20px;">💡 Tip: Check the browser console for more details.</p>`;
        }
        
        outputImg.innerHTML = errorHtml;
        submitBtn.disabled = false
        submitBtn.textContent = 'Create Art'
    }
}



// Example prompt test (uncomment to auto-run)
// generateImage("A 16th-century woman with long brown hair standing in front of a green vista with cloudy skies. She's looking at the viewer with a faint smile on her lips.")