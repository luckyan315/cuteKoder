#!/bin/bash

# sample skel script 
# Copyright (C) 2014 guanglin.an (lucky315.an@gmail.com )

#constants
menu_choice=""
current_cd=""
title_file="title.cdb"
tracks_file="tracks.cdb"
temp_file=./tmp.cdb.$$

#hook "ctrl + c"
#trap 'echo "hook ctrl + c" && rm -f $temp_file' INT

#hook "app exit "
#trap 'echo "hook exit"' EXIT

#help
help() {
    
    echo "Usage: `basename $0` <args>"
    echo ""
    echo "<description>"
    echo "arguments:"
    echo "  <options>"
    exit 1
}

getReturn() {
    echo -n "Press return "
    read ans
    return 0
}

getConfirm() {
    echo -n "Are you sure?"
    while 1 ; do
	read ans
	case "$ans" in
	    y | yes | Y | YES )
		return 0
		;;
	    n | no | N | NO )
		return 1
		;;
	    *)
		echo "Please Enter yes(y) or no(n)!"
		;;
	esac
    done
}

###############################################################################
# main
###############################################################################

main_menu() {
    clear
    cat <<EOF
Options:
    a) Add new CD
    f) Find CD
    c) count the CSs and tracks in the catalog
EOF
if [ "$cdcatnum" != "" ]; then
    cat <<EOF
    l) List tracks on $cdtitle
    r) Remove "$cdtitle"
    u) Update track information for $cdtitle
EOF
fi
echo "    q) Quit"
echo 
echo -n "Please enter choice and enter return"
read menu_choice
return
}

#show main menu
main_menu

insert_title() {
    echo $* >> $title_file
    return
}

insert_track() {
    echo $* >> $tracks_file
    return
}

add_record_tracks() {
    echo "Enter track information for this CD"
    echo "When no more tracks enter q"
    cdtrack=1
    cdtitle=""
    while [ "$cdtitle" != "q" ]; do
	echo -n "Track $cdtrack , track title? "
	read tmp
	cdtitle=${tmp%%,*}
	if [ "$tmp" != "$cdtitle" ]; then
	    echo "Sorry, no commas allowed"
	    continue
	fi

	if [ -n $cdtitle ]; then
	    if [ "$cdtitle" != "q" ]; then
		insert_track $cdnum,$cdtrack,$cdtitle
		let "cdtrack++"
	    fi
	else
	    let "cdtrack--"
	fi
    done

}

add_records() {
    #Prompt for the initial information
    echo -n "Enter catelog name"
read tmp
cdcatnum=${tmp%%,*}
    
}


#parse args
while getopts ":ht:" opt; do
    case $opt in
	h) help
	    ;;
	\?)
	    echo -e "\x1b[31mInvalid option: -$OPTARG\x1b[m" >&2
	    exit 1
	    ;;
	t)
	    arg="$OPTARG"
	    echo "Option -$opt: $OPTARG"
	    ;;
	
    esac
done
