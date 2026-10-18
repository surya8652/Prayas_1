from flask import Blueprint, jsonify

design_system_bp = Blueprint("design_system", __name__, url_prefix="/api/design-system")

DESIGN_SYSTEM_MANIFEST = {
    "name": "PRAYAS Academic Design System",
    "version": "1.0.0",
    "theme": "University Technology Platform (Academic SaaS)",
    "tokens": {
        "colors": {
            "background": {
                "hex": "#F8FAFC",
                "label": "Light Canvas Background",
                "tailwind": "bg-slate-50",
                "usage": "Page body background for crisp academic clarity"
            },
            "surface": {
                "hex": "#FFFFFF",
                "label": "Pure White Surfaces",
                "tailwind": "bg-white",
                "usage": "Cards, modals, tables, and content panels"
            },
            "primary_text": {
                "hex": "#0F172A",
                "label": "Deep Navy Text & Headings",
                "tailwind": "text-slate-900 / text-navy-900",
                "usage": "Primary typography, titles, and active navigation"
            },
            "brand_accent": {
                "hex": "#4F46E5",
                "label": "Academic Indigo Accent",
                "tailwind": "bg-indigo-600 / text-indigo-600",
                "usage": "Primary CTA buttons, active tab indicators, and key focus"
            },
            "synergy_accent": {
                "hex": "#0D9488",
                "label": "Subtle Synergy Teal",
                "tailwind": "bg-teal-600 / text-teal-800 / bg-teal-50",
                "usage": "Successful collaborations, cross-department matching, positive states"
            },
            "border": {
                "hex": "#E2E8F0",
                "label": "Neutral Gray Borders",
                "tailwind": "border-slate-200",
                "usage": "Card outlines, dividers, table cell borders"
            },
            "muted_text": {
                "hex": "#64748B",
                "label": "Secondary Slate Text",
                "tailwind": "text-slate-500",
                "usage": "Descriptions, metadata labels, timestamps, abstract summaries"
            }
        },
        "typography": {
            "primary_font": "Inter, sans-serif",
            "heading_font": "Plus Jakarta Sans, Inter, sans-serif",
            "weights": {
                "regular": 400,
                "medium": 500,
                "semibold": 600,
                "bold": 700,
                "extrabold": 800
            },
            "scale": {
                "display": "text-3xl sm:text-4xl font-extrabold tracking-tight",
                "h1": "text-2xl font-bold tracking-tight text-slate-900",
                "h2": "text-lg font-bold text-slate-900",
                "h3": "text-base font-semibold text-slate-900",
                "body": "text-sm text-slate-700 leading-relaxed",
                "caption": "text-xs text-slate-500",
                "badge": "text-[11px] font-semibold tracking-wide"
            }
        },
        "radii": {
            "card": "rounded-xl (0.75rem)",
            "button": "rounded-lg (0.5rem)",
            "badge": "rounded-md (0.375rem) or rounded-full",
            "modal": "rounded-2xl (1.0rem)"
        },
        "shadows": {
            "subtle": "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
            "card": "0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.06)",
            "cardHover": "0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)",
            "modal": "0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)"
        }
    },
    "components": [
        {"name": "Button", "variants": ["default (indigo)", "secondary (slate-100)", "outline (white/border)", "synergy (teal)", "navy", "destructive (rose)", "ghost"]},
        {"name": "Badge", "variants": ["default", "secondary", "teal / synergy", "success", "warning", "destructive", "outline"]},
        {"name": "Card", "parts": ["Card", "CardHeader", "CardTitle", "CardDescription", "CardContent", "CardFooter"]},
        {"name": "Input", "features": ["label", "error", "helperText", "icon prefix", "right element"]},
        {"name": "Select", "features": ["label", "error", "helperText", "chevron icon"]},
        {"name": "Textarea", "features": ["label", "error", "helperText"]},
        {"name": "Tabs", "parts": ["Tabs", "TabsList", "TabsTrigger", "TabsContent"]},
        {"name": "Modal", "features": ["accessible dialog", "escape listener", "backdrop dismissal", "responsive maxWidth"]},
        {"name": "Table", "parts": ["Table", "TableHeader", "TableBody", "TableRow", "TableHead", "TableCell"]},
        {"name": "EmptyState", "features": ["icon", "title", "description", "primary CTA", "secondary CTA"]},
        {"name": "Alert", "variants": ["info", "success", "warning", "error"]},
        {"name": "StatCard", "features": ["metric value", "title", "trend badge", "icon", "subtitle"]}
    ]
}

@design_system_bp.route("", methods=["GET"])
def get_design_system():
    return jsonify(DESIGN_SYSTEM_MANIFEST), 200
