import {interpolate, wcagContrast, formatRgb, parse, type Color} from "culori"

const isDark = (color: string | Color) => {
    try {
        if (wcagContrast(color, "black") < wcagContrast(color, "white")) {
            return true
        }
        return false
    } catch (e) {
        return false
    }
}
  
const generateForegroundColorFrom = function (input: string, percentage: number = 0.8): string {
    try {
        const first = parse(input);
        const second = isDark(input) ? parse("#fff") : parse("#000")

        if (!first || !second) return ""

        return formatRgb(interpolate([first, second])(percentage)).replace("rgb(", "").replace(")", "").replaceAll(", ", " ")
    } catch (e) {
        return ""
    }
}

const stringToColor = (str: string) => {
    let hash = 0
    str.split('').forEach(char => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })

    let color = '#'

    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += value.toString(16).padStart(2, '0')
    }

    return color
}
  

export { generateForegroundColorFrom, stringToColor }