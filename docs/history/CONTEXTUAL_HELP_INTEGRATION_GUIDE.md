# Contextual Help Integration Guide

This guide explains how to integrate the contextual help system into your forms and pages.

## Components Available

### 1. **HelpDrawer** (`src/components/onboarding/help-drawer.tsx`)
Full-featured side drawer with multiple help topics and navigation.

**Features:**
- Sidebar topic navigation
- Tips with bullet points
- Examples section with formatted display
- Contextual CTA messaging
- Customizable topics and default topic

**Usage:**
```tsx
import { HelpDrawer, type HelpTopic } from "@/components/onboarding/help-drawer"

const topics: HelpTopic[] = [
    {
        id: "topic-1",
        title: "Topic Title",
        description: "Topic description",
        tips: ["Tip 1", "Tip 2"],
        examples: ["Example 1", "Example 2"],
    },
]

export function MyForm() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2>My Form</h2>
                <HelpDrawer topics={topics} defaultTopic="topic-1" />
            </div>
            {/* Form content */}
        </div>
    )
}
```

### 2. **Pre-configured Help Components** (`src/components/onboarding/form-help-context.tsx`)
Ready-to-use help drawers for specific form types.

**Available Components:**
- `RequestFormHelp()` - For create request/solicitude forms
- `ServiceFormHelp()` - For create/edit service forms
- `ProposalFormHelp()` - For proposal submission forms
- `ProfileFormHelp()` - For profile edit forms
- `RegistrationFormHelp()` - For registration forms

**Usage:**
```tsx
import { RequestFormHelp } from "@/components/onboarding/form-help-context"

export function CreateRequestPage() {
    return (
        <div>
            <div className="flex items-center justify-between">
                <h1>Create New Request</h1>
                <RequestFormHelp />
            </div>
            {/* Form fields */}
        </div>
    )
}
```

### 3. **FormFieldHelper** (`src/components/onboarding/form-field-helper.tsx`)
Inline help text for individual form fields. Supports three display variants.

**Variants:**
- `inline` (default): Small help text below field
- `tooltip`: Info icon with hover tooltip
- `block`: Prominent help box with background

**Usage:**
```tsx
import { FormFieldHelper, TitleFieldHelper } from "@/components/onboarding/form-field-helper"

export function MyForm() {
    return (
        <div className="space-y-4">
            <div>
                <Label>Title *</Label>
                <Input placeholder="Enter a title..." />
                <TitleFieldHelper /> {/* Uses block variant by default */}
            </div>

            <div>
                <Label>
                    Custom Field
                    <FormFieldHelper
                        tip="This is a custom tip"
                        variant="tooltip"
                    />
                </Label>
                <Input />
            </div>
        </div>
    )
}
```

**Pre-configured Field Helpers:**
- `TitleFieldHelper()` - For title/name fields
- `DescriptionFieldHelper()` - For textarea descriptions
- `PriceFieldHelper()` - For price inputs
- `BudgetFieldHelper()` - For budget range fields
- `BioFieldHelper()` - For biography/about sections
- `AvailabilityFieldHelper()` - For availability/schedule
- `MessageFieldHelper()` - For proposal/message fields
- `TagsFieldHelper()` - For tag/keyword inputs

## Integration Steps

### Step 1: Add HelpDrawer to Page Header
Add the help drawer button to the page or form header:

```tsx
import { RequestFormHelp } from "@/components/onboarding/form-help-context"

export function CreateRequestPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Nueva Solicitud</h1>
                    <p className="text-muted-foreground">Describe el trabajo que necesitas</p>
                </div>
                <RequestFormHelp /> {/* Add here */}
            </div>

            <form>
                {/* Form fields */}
            </form>
        </div>
    )
}
```

### Step 2: Add Field-Level Helpers
Add inline helpers below important form fields:

```tsx
import {
    TitleFieldHelper,
    DescriptionFieldHelper,
    PriceFieldHelper,
} from "@/components/onboarding/form-field-helper"

export function CreateRequestForm() {
    return (
        <form className="space-y-6">
            <div>
                <Label htmlFor="title">Título de la Solicitud *</Label>
                <Input
                    id="title"
                    placeholder="Ej: Reparación de grifo de agua caliente"
                    required
                />
                <TitleFieldHelper />
            </div>

            <div>
                <Label htmlFor="description">Descripción Detallada *</Label>
                <Textarea
                    id="description"
                    placeholder="Describe el problema en detalle..."
                    required
                />
                <DescriptionFieldHelper />
            </div>

            <div>
                <Label htmlFor="budget">Presupuesto Estimado ($) *</Label>
                <Input
                    id="budget"
                    type="number"
                    placeholder="Ej: 5000"
                    required
                />
                <PriceFieldHelper />
            </div>

            <Button type="submit">Crear Solicitud</Button>
        </form>
    )
}
```

## Forms to Integrate

### High Priority (Critical User Experience)
1. **Create Solicitudes/Requests** (`src/app/create-request/page.tsx`)
   - Add: `RequestFormHelp()` at page header
   - Add field helpers: Title, Description, Budget, Photos

2. **Create Services** (`src/components/settings/services-manager.tsx`)
   - Add: `ServiceFormHelp()` at page header
   - Add field helpers: Title, Description, Tags, Price

3. **Send Proposals** (`src/components/proposals/proposal-form.tsx`)
   - Add: `ProposalFormHelp()` at form header
   - Add field helpers: Message, Price

4. **User Registration** (`src/app/(auth)/register/page.tsx`)
   - Add: `RegistrationFormHelp()` at page header
   - Add field helpers: Role selection, Password

### Medium Priority
5. **Profile Edit** (`src/app/dashboard/profile/profile-form.tsx`)
   - Add: `ProfileFormHelp()` at page header
   - Add field helpers: Bio, Tags, Availability

6. **Onboarding Services Step** (Already has tips, can enhance)
   - `src/components/onboarding/steps/onboarding-step-services.tsx`
   - Already has tip box, consider adding HelpDrawer

## Customization

### Create Custom Help Topics
```tsx
import { HelpDrawer, type HelpTopic } from "@/components/onboarding/help-drawer"

const CUSTOM_TOPICS: HelpTopic[] = [
    {
        id: "custom-1",
        title: "Your Topic Title",
        description: "Brief description of what this topic covers",
        tips: [
            "Tip 1",
            "Tip 2",
            "Tip 3",
        ],
        examples: [
            "✓ Good example",
            "✗ Bad example",
        ],
    },
]

export function MyCustomHelp() {
    return <HelpDrawer topics={CUSTOM_TOPICS} defaultTopic="custom-1" />
}
```

### Create Custom Field Helpers
```tsx
import { FormFieldHelper } from "@/components/onboarding/form-field-helper"

export function MyFieldHelper() {
    return (
        <FormFieldHelper
            tip="Your custom tip here"
            example="Your example here"
            variant="block" // or "inline" or "tooltip"
        />
    )
}
```

## Best Practices

1. **Page-Level Help**: Use `HelpDrawer` in page headers for comprehensive guidance
2. **Field-Level Help**: Use `FormFieldHelper` for specific field tips
3. **Consistency**: Use pre-configured helpers when available
4. **Brevity**: Keep tips concise (1-2 sentences each)
5. **Examples**: Include good and bad examples for clarity
6. **Testing**: Test on mobile - drawers should be responsive

## Mobile Responsiveness

All help components are fully responsive:
- `HelpDrawer`: Adjusts width (300px mobile, 500px desktop)
- `FormFieldHelper`: Adapts to container width
- `Sheet`: Uses full screen on mobile, side drawer on desktop

## Accessibility

All components include:
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus states for keyboard users
- Screen reader friendly content
- Semantic HTML structure

## Performance

- HelpDrawer: Lazy loads content only when opened
- FormFieldHelper: Minimal DOM impact (inline text only)
- No external API calls
- CSS-based animations (GPU accelerated)

## Future Enhancements

Potential improvements (for future iterations):
- [ ] Video tutorials embedded in help topics
- [ ] Context-aware help triggered by user inactivity
- [ ] A/B testing different help messages
- [ ] Analytics to track which help topics are most viewed
- [ ] AI-powered suggestions based on form input
- [ ] Localization for Spanish/Portuguese/English
- [ ] Integration with chatbot for complex questions
