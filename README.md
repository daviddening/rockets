# rockets
CS50 Project

A collaboration of Ben McGroaty and David Dening

## Rockets Dev Workflow

### Github
https://github.com/daviddening/rockets

### Set up
- Clone the repository locally (in our case cs50 VS Code)
`cd ..` //  got to /workspaces
`git clone git@github.com:daviddening/rockets.git` // this info is available from the 'Code' drop down on github

When prompted
`Are you sure you want to continue connecting (yes/no/[fingerprint])? Yes`
`Enter passphrase for key '/home/ubuntu/.ssh/id_rsa': <your usual password>`

You should see ‘rockets’ when you ls

```
/workspaces/ $ ls
1488756/  rockets/
```

- cd into the `rockets` directory
```
cd rockets
code README.md // !important: when prompted ‘Open file in CS50 Lab’  select ‘Cancel’
```

### Branching
- You should start in the main branch
```
 git status
On branch main...
```
- if not
```
git checkout main
```

- Make sure main is up-to-date with the origin
```
git pull
Enter passphrase for key '/home/ubuntu/.ssh/id_rsa':
Already up to date.
```

Create new branch with a short description
```
git checkout -b repository-setup-instructions
Switched to a new branch 'repository-setup-instructions'

git push origin // this is normally how you push code up to the repo I usually just run this to get the correct command
fatal: The current branch repository-setup-instructions has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin repository-setup-instructions

git push --set-upstream origin repository-setup-instructions
```
- Now a branch will exist in github
`https://github.com/daviddening/rockets/tree/repository-setup-instructions`

- Do normal development. // Codespace appears to automatically be saving he code
```
git add .
```
- Via the UI, look for 'contribute' and 'create new pull request'
- On the right hand side select Ben or Dave as the reviewer

