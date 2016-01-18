(set-env!
  :dependencies '[[adzerk/boot-cljs          "1.7.228-1"]
                  [adzerk/boot-reload        "0.4.4"]
                  [hoplon/boot-hoplon        "0.1.13"]
                  [hoplon/hoplon             "6.0.0-alpha10"]
                  [org.clojure/clojure       "1.7.0"]
                  [org.clojure/clojurescript "1.7.228"]
                  [tailrecursion/boot-jetty  "0.1.3"]
                  [org.martinklepsch/boot-garden "1.3.0-0"]
                  [datascript "0.15.0"]]
  :source-paths #{"src/hl" "src/garden"}
  :asset-paths  #{"assets"})

(require
  '[adzerk.boot-cljs         :refer [cljs]]
  '[adzerk.boot-reload       :refer [reload]]
  '[hoplon.boot-hoplon       :refer [hoplon prerender]]
  '[tailrecursion.boot-jetty :refer [serve]]
  '[org.martinklepsch.boot-garden :refer [garden]])

(def garden-prefixes
	[:transition
	 :transition-duration
	 :transition-property
	 :transform
	 :align-items
	 :justify-content
	 :flex-direction
	 :flex
	 :user-select])

(deftask dev
  "Build politiko for local development."
  []
  (comp
    (watch)
    (speak)
    (hoplon)
    (reload)
    (cljs)
    (garden :styles-var 'politiko.styles/main
            :output-to "css/main.css"
            :vendors ["webkit" "moz"]
            :auto-prefix garden-prefixes)
    (serve :port 8000)))

(deftask prod
  "Build politiko for production deployment."
  []
  (comp
    (hoplon)
    (cljs :optimizations :advanced)
    (prerender)))
