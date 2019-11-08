## Contributing

[fork]: /fork
[pr]: /compare

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1: 

We're thrilled that you'd like to contribute to this project. Your support of this project directly contributes the mission of Optum and UHG to help people live healthier lives and to help make the health system work better for everyone.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.  Please review our [Individual Contributor License Agreement ("ICL")](/docs/INDIVIDUAL_CONTRIBUTOR_LICENSE.md) prior to submitting changes to the project.

> :bulb:  Our ICL requires contributors to `sign-off` on each commit.  Adding an alias to the project will make this easier. ```git config --local format.signoff true``` 

### Pull Requests

The process described here has several goals:

- Maintain Knack's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible _Knack_
- Enable a sustainable system for _Knack_'s maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. [Fork][fork] and clone the repository
1. Make your change
      1. Sign-off every commit `git commit --signoff` or `git commit -s`, as directed by the [ICL](/docs/INDIVIDUAL_CONTRIBUTOR_LICENSE.md).

> :grey_exclamation: If you forget to sign a commit, then you'll have to do a bit of rewriting history. If it's the latest commit, you can just run either `git commit -a -s` or `git commit --amend --signoff` to fix things. It gets a little trickier if you have to change something farther back in history but there are some good instructions [on this page](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History) in the Changing Multiple Commit Messages section.

3. Push to your fork and [submit a pull request](https://help.github.com/en/articles/creating-a-pull-request)
1. Follow all instructions in [the template](PULL_REQUEST_TEMPLATE.md)
1. Follow the [styleguides](#styleguides)
1. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing.

### What to expect next

We make every effort to perform an initial review of all PRs within 1 business day.  While the prerequisites above must be satisfied prior to having your pull request approved, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.  

Here are a few things you can do that will increase the likelihood of your pull request being accepted:

- Keep your change as focused as possible. If there are multiple changes you would like to make that are not dependent upon each other, consider submitting them as separate pull requests.
- Write a [good commit message](#git-commit-messages).

Work in Progress pull request are also welcome to get feedback early on, or if there is something blocked you.

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* When only changing documentation, include `[ci skip]` in the commit title
* Consider starting the commit message with an applicable emoji:
    * :art: `:art:` when improving the format/structure of the code
    * :racehorse: `:racehorse:` when improving performance
    * :non-potable_water: `:non-potable_water:` when plugging memory leaks
    * :memo: `:memo:` when writing docs
    * :penguin: `:penguin:` when fixing something on Linux
    * :apple: `:apple:` when fixing something on macOS
    * :checkered_flag: `:checkered_flag:` when fixing something on Windows
    * :bug: `:bug:` when fixing a bug
    * :fire: `:fire:` when removing code or files
    * :green_heart: `:green_heart:` when fixing the CI build
    * :white_check_mark: `:white_check_mark:` when adding tests
    * :lock: `:lock:` when dealing with security
    * :arrow_up: `:arrow_up:` when upgrading dependencies
    * :arrow_down: `:arrow_down:` when downgrading dependencies
    * :shirt: `:shirt:` when removing linter warnings

### JavaScript Styleguide

All JavaScript must adhere to [JavaScript Standard Style](https://standardjs.com/).

## Resources

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Using Pull Requests](https://help.github.com/articles/about-pull-requests/)
- [GitHub Help](https://help.github.com)
