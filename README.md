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

## Contributing

* [Fork](https://help.github.com/articles/fork-a-repo)
* Create a topic branch - `git checkout -b my_feature`
* Push to your branch - `git push origin my_feature`
* Create a [pull request](http://help.github.com/pull-requests/) from your branch

Please add a [changelog](CHANGELOG.md) entry with your name for new features and bug fixes.

## License

dups-tracker is licensed under the [MIT License](http://opensource.org/licenses/MIT).
