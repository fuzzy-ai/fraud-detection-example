# agent.coffee
# Copyright 2017 9165584 Canada Corporation <legal@fuzzy.ai>

module.exports =
  name: "Fraud Detection"
  outputs:
    likelihood:
      veryLow: [0, 25]
      low: [0, 25, 50]
      medium: [25, 50, 75]
      high: [50, 75, 100]
      veryHigh: [75, 100]
  inputs:
    userAgeInDays:
      veryNew: [0, 1]
      new: [0, 3.5, 7]
      recent: [3.5, 7, 15]
      earlier: [7, 15, 30]
      before: [15, 30, 90]
    priceDifference:
      veryLow: [-50, -25]
      low: [-50, -25, 0]
      medium: [-25, 0, 25]
      high: [0, 25, 50]
      veryHigh: [25, 50]
    shippingDistance:
      veryLow: [0, 10]
      low: [0, 10, 50]
      medium: [10, 50, 300]
      high: [50, 300, 3000]
      veryHigh: [3000, 5000]
    IPDistance:
      veryLow: [0, 10]
      low: [0, 10, 50]
      medium: [10, 50, 300]
      high: [50, 300, 3000]
      veryHigh: [3000, 5000]
    phoneDistance:
      veryLow: [0, 10]
      low: [0, 10, 50]
      medium: [10, 50, 300]
      high: [50, 300, 3000]
      veryHigh: [3000, 5000]
    shippingOption:
      "very low": [0, 5]
      "low": [0, 5, 10]
      "medium": [5, 10, 15]
      "high": [10, 15, 20]
      "very high": [15, 20]
    numberPreviousFromIP:
      "very low": [0, 5]
      "low": [0, 5, 10]
      "medium": [5, 10, 15]
      "high": [10, 15, 20]
      "very high": [15, 20]
    numberPreviousShipping:
      "very low": [0, 5]
      "low": [0, 5, 10]
      "medium": [5, 10, 15]
      "high": [10, 15, 20]
      "very high": [15, 20]
  rules: [
    '''userAgeInDays DECREASES likelihood WITH 1.0'''
    '''priceDifference INCREASES likelihood WITH 0.5'''
    '''shippingDistance INCREASES likelihood WITH 1.0'''
    '''IPDistance INCREASES likelihood WITH 0.75'''
    '''phoneDistance INCREASES likelihood WITH 0.5'''
    '''shippingOption INCREASES likelihood WITH 1.0'''
    '''numberPreviousFromIP INCREASES likelihood WITH 0.5'''
    '''numberPreviousShipping INCREASES likelihood WITH 1.0'''
  ]
