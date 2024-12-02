# Advent of Code 2024

My solutions to the [AoC 2024](https://adventofcode.com/2024) challenges written in [Civet](https://civet.dev).

## Day 2: Red-Nosed Reports ⭐⭐

```ts
reports := input
  |> getLines
  |> .map toNumbers

function isSafe(report: number[])
  dir := report.1 - report.0 > 0

  for every i of [0...report# - 1]
    (1 <= report[i + int dir] - report[i + int !dir] <= 3)

part1 := reports.filter (report) => isSafe report
part2 := reports.filter (report) => isSafe(report) or report.some (level, index) => isSafe report.toSpliced index, 1

console.log part1#
console.log part2#
```

## Day 1: Historian Hysteria ⭐⭐

```ts
[left, right] := input
  |> getLines
  |> .map toNumbers
  |> rotate
  |> .map .sort asc

log 'Part 1', for sum i in left
  abs left[i] - right[i]

log 'Part 2', for sum i in left
  left[i] * counter(right)[left[i]]
```
