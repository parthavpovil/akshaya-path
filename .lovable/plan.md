

## Plan: Scripted Demo Chat Flow for Building Permit (Section Number)

### What this does
Rewrites `src/pages/v1/ApplyChat.tsx` to run a fully scripted, typewriter-driven demo conversation about applying for a **Building Section Number** (building permit). The user never types — each reply is auto-filled in the input bar with a typewriter animation (same style as DemoLogin), and the user just clicks Send. After the chatbot phase, when the user agrees to apply, the chat UI transitions into a **step-by-step application form UI**.

### Scripted conversation flow

1. **Bot greeting** (auto, on load): "Namaste! I'm your Akshaya Agent. I can help you with government services..."
2. **Auto-typed user input**: "I want to get a section number for my new building"
3. **Bot reply**: Explains the Building Section Number scheme — 3 steps (Permit File → Completion Certificate → Section Number), documents needed, process overview
4. **Auto-typed user input**: "What documents do I need?"
5. **Bot reply**: Lists required documents (land deed, building plan, licensee details, Aadhaar, etc.)
6. **Auto-typed user input**: "Yes, I want to apply for the permit file"
7. **Bot reply**: "Starting your application for Building Permit File..." — then the UI transitions

### UI transition after "Yes, apply"
- Chat area smoothly transitions into a **multi-step application form** with:
  - **Step 1**: Owner details (pre-filled dummy data)
  - **Step 2**: Land & building details
  - **Step 3**: Upload documents (dummy file chips)
  - **Step 4**: Review & Submit
- A progress bar at the top shows current step
- Submit shows a success animation and navigates to `/applications`

### Technical approach

**Single file change**: `src/pages/v1/ApplyChat.tsx`

- Add a `demoScript` array of `{ role, content, autoType? }` entries defining the entire conversation
- Add a `scriptIndex` state tracking position in the script
- After bot message appears, trigger typewriter effect on the next user message into the input textarea (reusing DemoLogin's `setInterval` pattern with `TYPE_SPEED = 30`)
- User clicks Send → message sent instantly, bot "types" for 1.2s, then next bot message appears
- When script reaches the "apply" confirmation, set a `phase` state to `"application"` which swaps the chat+input area for the form UI
- Form UI is a self-contained component within the same file with 4 steps, dummy pre-filled data, and a submit action

**Also update**: `src/pages/v1/Schemes.tsx` — add a "Building Section Number" scheme card to the grid so users can click into it.

### Key details
- Typewriter speed: ~30ms per character (fast but visible)
- Delay between bot reply appearing and next auto-type starting: ~800ms
- Send button pulses (`animate-glow-pulse`) when auto-type completes to prompt clicking
- Input is read-only during auto-typing, editable otherwise (though script drives it)
- The form steps use glass-card styling consistent with the rest of the app

