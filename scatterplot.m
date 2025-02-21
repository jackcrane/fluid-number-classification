function scatter_plot_3d()
    % Load JSON file
    jsonData = fileread('vectors.json');
    data = jsondecode(jsonData);

    % Define labels for vector components
    labels = {
        'Total filled pixels', '0 degree left', '0 degree right', ...
        '90 degree left', '90 degree right', '180 degree left', ...
        '180 degree right', '270 degree left', '270 degree right'
    };

    % Extract characters and vectors
    numEntries = numel(data);
    characters = cell(numEntries, 1);
    vectors = zeros(numEntries, length(data(1).vector));

    for i = 1:numEntries
        characters{i} = data(i).character;
        vectors(i, :) = data(i).vector;
    end

    % Create UI Figure
    fig = figure('Name', '3D Scatter Plot', 'NumberTitle', 'off', 'Position', [100, 100, 800, 600]);

    % Dropdown Menus
    uicontrol(fig, 'Style', 'text', 'String', 'X-Axis:', 'Position', [50, 550, 100, 20]);
    xDropdown = uicontrol(fig, 'Style', 'popupmenu', 'String', labels, 'Position', [50, 520, 150, 30]);

    uicontrol(fig, 'Style', 'text', 'String', 'Y-Axis:', 'Position', [250, 550, 100, 20]);
    yDropdown = uicontrol(fig, 'Style', 'popupmenu', 'String', labels, 'Position', [250, 520, 150, 30]);

    uicontrol(fig, 'Style', 'text', 'String', 'Z-Axis:', 'Position', [450, 550, 100, 20]);
    zDropdown = uicontrol(fig, 'Style', 'popupmenu', 'String', labels, 'Position', [450, 520, 150, 30]);

    % Save Button
    saveButton = uicontrol(fig, 'Style', 'pushbutton', 'String', 'Save Plot', 'Position', [650, 520, 100, 30]);

    % Plot Area
    ax = axes('Parent', fig, 'Position', [0.1, 0.1, 0.8, 0.65]);

    % Enable data cursor mode
    dcm = datacursormode(fig);
    datacursormode on;

    % Callback Function for Updating Plot
    function update_plot(~, ~)
        % Get selected indices
        index1 = xDropdown.Value;
        index2 = yDropdown.Value;
        index3 = zDropdown.Value;

        % Prepare scatter plot data
        x = vectors(:, index1);
        y = vectors(:, index2);
        z = vectors(:, index3);

        % Remove entries where ANY of x, y, or z is less than 10
        validIndices = ~(x < 10 | y < 10 | z < 10);
        x = x(validIndices);
        y = y(validIndices);
        z = z(validIndices);
        validIndicesOriginal = find(validIndices); % Save original indices

        % Generate unique colors and marker styles for each character
        uniqueChars = unique(characters(validIndices));
        numChars = length(uniqueChars);
        cmap = lines(numChars);

        % Marker styles
        markers = {'o', 's', 'd', '^', 'v', '>', '<', 'p', 'h', '*'};
        markerCount = length(markers);

        % Assign colors and markers
        charColors = containers.Map(uniqueChars, num2cell(cmap, 2));
        charMarkers = containers.Map(uniqueChars, markers(mod(0:numChars-1, markerCount) + 1));

        % Clear previous plot
        cla(ax);
        hold(ax, 'on');
        view(ax, 3);
        grid(ax, 'on');

        % Plot each character with a unique color and marker
        legendEntries = cell(numChars, 1);
        scatterPoints = gobjects(numChars, 1);
        for i = 1:numChars
            char = uniqueChars{i};
            mask = strcmp(characters(validIndices), char);
            if any(mask)
                scatterPoints(i) = scatter3(ax, x(mask), y(mask), z(mask), 10, charColors(char), charMarkers(char), 'filled');
            else
                scatterPoints(i) = scatter3(ax, nan, nan, nan, 10, charColors(char), charMarkers(char), 'filled');
            end
            legendEntries{i} = char;
        end

        % Set Labels
        xlabel(ax, labels{index1});
        ylabel(ax, labels{index2});
        zlabel(ax, labels{index3});
        title(ax, '3D Scatter Plot of Selected Vector Components');

        % Auto-scale axes
        xlim(ax, [min(x) - 10, max(x) + 10]);
        ylim(ax, [min(y) - 10, max(y) + 10]);
        zlim(ax, [min(z) - 10, max(z) + 10]);

        % Create legend at bottom
        legend(ax, scatterPoints, legendEntries, 'Location', 'southoutside', 'Orientation', 'horizontal');

        hold(ax, 'off');

        % Update data cursor mode for clicking points
        set(dcm, 'UpdateFcn', @(obj, event) on_click(event, x, y, z, validIndicesOriginal));
    end

    % Function to Handle Clicks on Points
    function output_txt = on_click(event_obj, x, y, z, originalIndices)
        % Get clicked point position
        pos = get(event_obj, 'Position');
        clickX = pos(1);
        clickY = pos(2);
        clickZ = pos(3);

        % Find the closest point
        distances = sqrt((x - clickX).^2 + (y - clickY).^2 + (z - clickZ).^2);
        [~, closestIndex] = min(distances);
        clickedIndex = originalIndices(closestIndex); % Convert back to original index

        % Display index
        output_txt = sprintf('Index: %d', clickedIndex);
        fprintf('Clicked on point with index: %d\n', clickedIndex);
    end

    % Save Button Callback
    function save_plot(~, ~)
        % Open file picker
        [file, path] = uiputfile({'*.png', 'PNG Image'; '*.jpg', 'JPEG Image'; '*.fig', 'MATLAB Figure'}, 'Save Plot As');
        if file == 0
            return; % User cancelled
        end

        % Full save path
        saveFilePath = fullfile(path, file);
        saveas(fig, saveFilePath);
        fprintf('Plot saved to %s\n', saveFilePath);
    end

    % Attach Callbacks
    set(xDropdown, 'Callback', @update_plot);
    set(yDropdown, 'Callback', @update_plot);
    set(zDropdown, 'Callback', @update_plot);
    set(saveButton, 'Callback', @save_plot);

    % Initial Plot
    update_plot();
end

scatter_plot_3d()