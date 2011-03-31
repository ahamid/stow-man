#!/usr/bin/env seed  

imports.gi.versions.Gtk = "2.0";
Gtk = imports.gi.Gtk;
GtkBuilder = imports.gtkbuilder;

Gtk.init(Seed.argv);

b = new Gtk.Builder();
b.add_from_file("stow-man.glade");

function run_stow(unstow) {
  var src = b.get_object('srcdir').get_filename();
  var tgt = b.get_object('targetdir').get_filename();

  var parsed = src.match(/^(.*)\/(.*)$/)
  var stow_dir = parsed[1];
  var dir = parsed[2];
  var command = "stow -v -n " + (unstow ? "-D" : "") + " -t " + tgt + " -d " + stow_dir + " " + dir;

  var spawn_output = Seed.spawn(command);
  print(spawn_output.stdout);
  print(spawn_output.stderr);
  b.get_object('output-buffer').text = spawn_output.stdout;
  b.get_object('output-buffer').text += spawn_output.stderr;
};

handlers = {
    'on_stow-man_destroy': function(button) { Seed.quit(); },
    on_Stow_clicked:       function(button) { run_stow(false); },
    on_Unstow_clicked:     function(button) { run_stow(true); }
};

b.connect_signals(handlers);

d = b.get_object("stow-man");

d.show_all();

Gtk.main();
