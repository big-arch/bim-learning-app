using System;
using System.IO;
using System.Text;
using System.Globalization;

// Generates compact, offline vector plates. Pass the project's assets directory.
internal static class WorkshopArt {
    static string Line(string points, string color, int width) {
        return "<path d='" + points + "' fill='none' stroke='" + color +
               "' stroke-linejoin='round' stroke-linecap='round' stroke-width='" + width + "'/>";
    }
    static string Plate(int i, string accent) {
        const string ink = "#d9ece9";
        var art = new StringBuilder();
        if (i == 4 || i == 2) {
            for (int n=0;n<8;n++)
                art.Append(Line("M30 "+(150+n*8)+" Q170 "+(10+n*7)+" 310 "+(105+n*5)+" T590 "+(108+n*8)+" T840 "+(50+n*8), n==3?accent:"#48747b", n==3?5:2));
            art.Append(Line("M25 185 C200 225 280 35 466 115 S670 180 825 40",ink,4));
        } else if (i==6 || i==7 || i==9) {
            for(int n=0;n<4;n++) {
                int x=90+n*175, y=65+(n%2)*46;
                if(n<3) art.Append(Line("M"+(x+40)+" "+y+" L"+(x+175)+" "+(65+((n+1)%2)*46),accent,3));
                art.Append("<rect x='"+x+"' y='"+(y-20)+"' width='85' height='65' rx='8' fill='#20424e' stroke='"+ink+"'/>");
                for(int j=0;j<3;j++) art.Append(Line("M"+(x+12)+" "+(y-4+j*12)+"h54",j==1?accent:ink,2));
            }
        } else if(i==8) {
            art.Append("<path d='M100 48h260v90H175l-38 32v-32h-37z' fill='#245262' stroke='"+ink+"'/><path d='M390 82h240v80h-40v28l-46-28H390z' fill='#4b535b' stroke='"+accent+"'/>");
            art.Append(Line("M139 79h170m-170 27h125M432 112h152m-152 24h92",ink,4));
        } else {
            int floors=2+(i%4);
            for(int n=0;n<floors;n++){
                int y=145-n*20;
                art.Append("<path d='M170 "+y+"l210 -82 222 65 -210 81z' fill='"+(n==floors-1?accent:"#305563")+"' stroke='"+ink+"' stroke-width='2'/>");
                art.Append(Line("M170 "+y+"v12l222 65 210 -81v-12", ink,2));
            }
            art.Append(Line("M60 189h660M95 167l40 -14m493 -100l66 -27",accent,2));
        }
        return art.ToString();
    }
    public static void Main(string[] args) {
        if(args.Length!=1) throw new ArgumentException("Pass the output directory");
        CultureInfo.DefaultThreadCurrentCulture=CultureInfo.InvariantCulture;
        string[] ids={"bim","revit","navisworks","autocad","civil3d","practice","manager","revitserver","english","software"};
        string[] colors={"#d7ab65","#71c0ce","#efaa71","#e48d75","#9dc782","#bab0dd","#d7b967","#80c3cc","#ebaa80","#a39ddf"};
        Directory.CreateDirectory(args[0]);
        for(int i=0;i<ids.Length;i++){
            string svg="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 210'><defs><linearGradient id='bg' x2='1' y2='1'><stop stop-color='#102636'/><stop offset='1' stop-color='#244b52'/></linearGradient><pattern id='grid' width='24' height='24' patternUnits='userSpaceOnUse'><path d='M24 0H0V24' fill='none' stroke='#a7cfcf' stroke-opacity='.12'/></pattern></defs><rect width='800' height='210' fill='url(#bg)'/><rect width='800' height='210' fill='url(#grid)'/>"+Plate(i,colors[i])+"<g fill='#cce4df' font-family='monospace' font-size='12' letter-spacing='2'><text x='18' y='24'>STUDY / "+(i+1).ToString("00")+"</text></g></svg>";
            File.WriteAllText(Path.Combine(args[0],ids[i]+".svg"), svg, new UTF8Encoding(false));
        }
    }
}
