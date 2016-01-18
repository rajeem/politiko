(ns politiko.styles
	(:require [garden.def :refer [defstylesheet defstyles]]
						[garden.units :as u :refer [px percent s]]
						[garden.color :as color]))

(defstyles main
  [:body {:background-color "pink"
          :font-family "Roboto"}])
