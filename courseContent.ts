
import type { CourseModule } from './types';

export const COURSE_CURRICULUM: CourseModule[] = [
  {
    moduleTitle: "Module 1: The Fundamentals (Beginner)",
    description: "Start your journey by mastering the essential building blocks of pen drawing. This module covers tools, basic strokes, and how to see the world in shapes.",
    lessons: [
      {
        title: "Lesson 1: Your Toolkit",
        content: [
          "Welcome to the world of ink drawing! Your primary tool is the pen. There are many types: fineliners, fountain pens, ballpoints, and brush pens. For now, a simple set of black fineliners (like Microns or Staedtler Pigment Liners) in different sizes (e.g., 0.1mm, 0.3mm, 0.5mm) is perfect.",
          "You'll also need good quality paper. A smooth, thick paper (like Bristol board) is ideal as it won't let the ink bleed. A simple sketchbook with paper over 100gsm will also work well to start. Don't forget a pencil and an eraser for initial sketching, but our goal is to become confident enough to draw directly with ink!",
        ],
      },
      {
        title: "Lesson 2: The Power of Line",
        content: [
          "Line is everything in ink drawing. Practice drawing straight lines, curved lines, and wavy lines. Try to keep your hand steady. Vary the pressure and speed to see how it affects the line's character. A quick, confident line often looks better than a slow, shaky one.",
          "An important technique is 'contour drawing.' This means drawing the outline of an object without lifting your pen. Pick a simple object like a coffee mug and try to draw its edges in one continuous line. This exercise trains your hand-eye coordination.",
        ],
      },
      {
        title: "Lesson 3: Seeing in Shapes",
        content: [
          "Every complex object can be broken down into basic geometric shapes: circles, squares, triangles, rectangles, and ovals. This is a fundamental concept in drawing.",
          "Look at a chair. Can you see the rectangles that make up the seat and back? Look at a flower. Can you see the circle for the center and ovals for the petals? Practice looking at objects around you and mentally deconstructing them into these simple forms. Lightly sketch these shapes with a pencil before committing to ink.",
        ],
      },
      {
        title: "Lesson 4: Introduction to Shading",
        content: [
          "Since you can't blend ink like pencil, you create value (light and shadow) using techniques. The most common is 'hatching' - drawing a series of parallel lines. The closer the lines, the darker the area appears.",
          "'Cross-hatching' is the next step: drawing another set of parallel lines over the first, usually in a different direction. This creates even darker tones. Practice creating a value scale from light to dark using just hatching and cross-hatching.",
        ],
      },
    ],
  },
  {
    moduleTitle: "Module 2: Building Worlds (Intermediate)",
    description: "Now that you know the basics, let's create believable scenes. This module introduces perspective, composition, and adding realistic textures.",
    lessons: [
      {
        title: "Lesson 5: Creating Depth with Perspective",
        content: [
          "Perspective gives your 2D drawings a 3D feel. The simplest form is 'one-point perspective.' Imagine a road stretching to the horizon. All parallel lines (the sides of the road) appear to converge at a single 'vanishing point' on the horizon line.",
          "Practice by drawing a simple scene like a street or a railway track. Establish your horizon line, pick a vanishing point, and draw lines radiating from it to guide the placement of your buildings, trees, and other elements.",
        ],
      },
      {
        title: "Lesson 6: The Art of Composition",
        content: [
          "Composition is how you arrange elements in your drawing to create a pleasing and effective image. A classic guideline is the 'Rule of Thirds.' Imagine your paper is divided into a 3x3 grid. Placing key points of interest on the intersections of these lines often creates a more dynamic composition than centering the subject.",
          "Think about balance. A large, dark shape on one side can be balanced by a smaller, detailed shape on the other. Lead the viewer's eye through the drawing by arranging elements in a path. Don't be afraid of empty space ('negative space'); it's just as important as the subject itself.",
        ],
      },
      {
        title: "Lesson 7: Drawing Texture",
        content: [
          "Texture is what makes an object look like it's made of a specific material. How would you draw the roughness of tree bark versus the smoothness of glass? It's all about mark-making.",
          "For wood, use long, slightly wavy parallel lines to suggest grain. For fur, use short, soft, overlapping strokes. For metal, use high contrast with sharp highlights (areas of pure white paper) and dark shadows. Practice creating a 'texture library' by drawing squares and filling them with different textures like brick, fabric, and stone.",
        ],
      },
    ],
  },
  {
    moduleTitle: "Module 3: Finding Your Voice (Advanced)",
    description: "With solid skills, it's time to develop your unique style. This module explores advanced techniques and encourages you to experiment and create with confidence.",
    lessons: [
      {
        title: "Lesson 8: Advanced Shading Techniques",
        content: [
          "Beyond hatching, there are other ways to create value. 'Stippling' involves using tiny dots to build up tone. The denser the dots, the darker the value. This is time-consuming but creates beautiful, soft textures.",
          "'Scribbling' is a more expressive technique. Use random, looping, and chaotic lines to build up shadow. This can add a lot of energy and personality to your drawing. Experiment with combining these techniques in a single piece.",
        ],
      },
      {
        title: "Lesson 9: Line Weight and Expressiveness",
        content: [
          "Varying the thickness of your lines ('line weight') can dramatically improve your drawings. Use thicker lines for objects that are closer to the viewer or for defining the main outline of a subject. Use thin, delicate lines for details, textures, or objects in the distance.",
          "This not only adds depth but also creates visual interest. A drawing where all lines are the same thickness can look flat and cartoonish. Practice drawing a single object three times, each time focusing on using a different range of line weights.",
        ],
      },
      {
        title: "Lesson 10: Developing Your Personal Style",
        content: [
          "Your style is a combination of everything you've learned, filtered through your own personality. Do you prefer clean, minimalist lines or complex, detailed cross-hatching? Do you enjoy realistic drawings or more stylized, expressive work?",
          "Look at artists you admire. What do you like about their work? Don't copy them, but analyze their techniques. The most important thing is to draw a lot. Your style will emerge naturally over time. Now, head over to the Practice Area and start applying everything you've learned. Experiment, have fun, and find your artistic voice!",
        ],
      },
    ],
  },
];
