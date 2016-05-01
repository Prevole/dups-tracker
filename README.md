# Files duplicated tracker

**Walk on the file system to identify duplicated files.**

[![License](https://img.shields.io/github/license/prevole/dups-tracker.svg)](LICENSE.txt)

## Requirements

* NodeJS 5.10+

## Installation

```bash
npm install -g dups-tracker
```

## Usage

Run the following command to walk through a single directory to detect duplicated files:

```
dups-tracker <folderToCheck>
```

You can also specify multiple folders. In this case, the verifications are done across all the specified directories

```
dups-tracker <firstFolder> <secondFolder>
```

In other words, with this directory tree:

```
tmp/
 |- a/
   |- a.txt
   |- b.txt
 |- b/
   |- c.txt
   |- d.txt
```

the following commands have the same results.

```
dups-tracker tmp

# is the same as

dups-tracker tmp/a tmp/b
```

Run the following command to show more help

```
Usage: dups-tracker [options] directory [directories]

Options:
  -c, --console  Use the console reporter  [boolean] [default: true]
  -t, --html     Use the html reporter  [boolean]
  -o, --out      HTML output file when -t is used
  -e, --exclude  Exclude files following a minimatch pattern (https://github.com/isaacs/minimatch)
  -h, --help     Show help  [boolean]
  --version      Show version number  [boolean]

Examples:
  dups-tracker -c -t html tmp/a tmp/b tmp/c   Use console and html reporters to check the duplicates of directories a, b and c in tmp
  dups-tracker -e "**/.DS_Store" tmp/a tmp/b  Use console reporter to check the duplicates of directories a and b in tmp. It will excludes the .DS_Store files in all directories.
```

If you want to exclude some file patterns, you can use `-e` option with [minimatch](https://github.com/isaacs/minimatch) patterns. Maybe you will have to put your patterns between quotes.

## Contributing

* [Fork](https://help.github.com/articles/fork-a-repo)
* Create a topic branch - `git checkout -b my_feature`
* Push to your branch - `git push origin my_feature`
* Create a [pull request](http://help.github.com/pull-requests/) from your branch

Please add a [changelog](CHANGELOG.md) entry with your name for new features and bug fixes.

## License

dups-tracker is licensed under the [MIT License](http://opensource.org/licenses/MIT).
